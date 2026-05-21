<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use ApiResponses;

    private const DEFAULT_PROFILE_PICTURE = 'profile_pictures/1778642103_person.jpg';
    private const GMAIL_REGEX = '/^[A-Za-z0-9._%+-]+@gmail\.com$/';
    private const PUBLIC_STORAGE_PREFIX = 'app/public/';

    /**
     * POST /api/auth/register
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email:rfc,dns',
                'unique:users,email',
                'regex:' . self::GMAIL_REGEX,
            ],
            'password' => 'required|string|min:8',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,heic|max:2048',
        ]);

        $validated['email'] = strtolower($validated['email']);
        $validated['password'] = Hash::make($validated['password']);
        $validated['is_premium'] = false;

        if ($request->hasFile('profile_picture')) {
            $filename = time() . '_' . $request->file('profile_picture')->getClientOriginalName();
            $validated['profile_picture'] = $request->file('profile_picture')->storeAs('profile_pictures', $filename, 'public');
        } else {
            $validated['profile_picture'] = self::DEFAULT_PROFILE_PICTURE;
        }

        $user = User::create($validated);

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => [
                'required',
                'email:rfc,dns',
                'regex:' . self::GMAIL_REGEX,
            ],
            'password' => 'required|string',
        ]);

        $validated['email'] = strtolower($validated['email']);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return $this->errorResponse('Invalid email or password', 401);
        }

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return $this->unauthorizedResponse();
        }

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        return $this->successResponse($user);
    }

    /**
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logged out successfully');
    }

    /**
     * GET /api/users
     */
    public function index(Request $request)
    {
        if ($request->query('me')) {
            return $this->currentUserResponse($request);
        }

        return $this->usersListResponse($request);
    }

    private function currentUserResponse(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser) {
            return $this->unauthorizedResponse();
        }

        $user = User::with([
            'recentViewedRecipes',
            'recommendations',
            'subscriptions',
        ])->find($authUser->id);

        if (!$user) {
            return $this->notFoundResponse('User');
        }

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        return $this->successResponse($user);
    }

    private function usersListResponse(Request $request)
    {
        $page = $request->query('page');
        $perPage = (int) $request->query('perPage', 20);

        if ($page) {
            $paginator = User::paginate($perPage);
            $usersCollection = collect($paginator->items());
        } else {
            $usersCollection = User::limit((int) $request->query('limit', 100))->get();
            $paginator = null;
        }

        $usersCollection = $usersCollection->map(function ($user) {
            if (!$user->profile_picture) {
                $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
            }

            return $user;
        });

        return $this->successResponse(
            $usersCollection,
            null,
            200,
            array_merge(
                ['count' => $usersCollection->count()],
                $paginator ? ['meta' => $this->paginationMeta($paginator)] : []
            )
        );
    }

    /**
     * GET /api/users/{id}
     */
    public function show($id)
    {
        $user = User::with([
            'recentViewedRecipes',
            'recommendations',
            'subscriptions',
        ])->find($id);

        if (!$user) {
            return $this->notFoundResponse('User');
        }

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        return $this->successResponse($user);
    }

    /**
     * PUT /api/user
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email:rfc,dns',
                'unique:users,email,' . $user->id,
                'regex:' . self::GMAIL_REGEX,
            ],
            'password' => 'sometimes|string|min:8',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,heic|max:2048',
            'remove_profile_picture' => 'sometimes|boolean',
        ]);

        if (isset($validated['email'])) {
            $validated['email'] = strtolower($validated['email']);
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        if ($request->filled('remove_profile_picture')) {
            if (
                $user->profile_picture &&
                $user->profile_picture !== self::DEFAULT_PROFILE_PICTURE &&
                file_exists(storage_path(self::PUBLIC_STORAGE_PREFIX . $user->profile_picture))
            ) {
                unlink(storage_path(self::PUBLIC_STORAGE_PREFIX . $user->profile_picture));
            }

            $validated['profile_picture'] = null;
        }

        if ($request->hasFile('profile_picture')) {
            if (
                $user->profile_picture &&
                $user->profile_picture !== self::DEFAULT_PROFILE_PICTURE &&
                file_exists(storage_path(self::PUBLIC_STORAGE_PREFIX . $user->profile_picture))
            ) {
                unlink(storage_path(self::PUBLIC_STORAGE_PREFIX . $user->profile_picture));
            }

            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $validated['profile_picture'] = $file->storeAs('profile_pictures', $filename, 'public');
        }

        $user->update($validated);

        return $this->successResponse($user, 'User updated successfully');
    }

    /**
     * DELETE /api/users/{id}
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->user()->id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }

    /**
     * POST /api/profile/update-picture
     */
    public function updateProfilePicture(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,webp,heic|max:2048',
        ]);

        if (
            $user->profile_picture &&
            $user->profile_picture !== self::DEFAULT_PROFILE_PICTURE &&
            file_exists(storage_path(self::PUBLIC_STORAGE_PREFIX . $user->profile_picture))
        ) {
            unlink(storage_path(self::PUBLIC_STORAGE_PREFIX . $user->profile_picture));
        }

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $user->profile_picture = $file->storeAs('profile_pictures', $filename, 'public');
            $user->save();
        }

        return $this->successResponse($user, 'Profile picture updated successfully');
    }
}
