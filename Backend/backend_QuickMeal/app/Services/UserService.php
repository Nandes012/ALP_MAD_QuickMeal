<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService
{
    private const DEFAULT_PROFILE_PICTURE = 'profile_pictures/1778642103_person.jpg';
    private const GMAIL_REGEX = '/^[A-Za-z0-9._%+-]+@gmail\.com$/';
    private const PUBLIC_STORAGE_PREFIX = 'app/public/';

    public function __construct(private readonly UserRepository $repo)
    {
    }

    public function register(Request $request): array
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

        $user = $this->repo->create($validated);

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function login(Request $request): ?array
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

        $user = $this->repo->findByEmail($validated['email']);

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return null;
        }

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function me($user)
    {
        if (!$user) {
            return null;
        }

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        return $user;
    }

    public function findCurrentUserDetails($authUser)
    {
        if (!$authUser) {
            return null;
        }

        $user = $this->repo->findWithRelations($authUser->id);

        if (!$user) {
            return null;
        }

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        return $user;
    }

    public function listUsers(Request $request)
    {
        return $this->repo->paginateList($request);
    }

    public function findById($id)
    {
        $user = $this->repo->findWithRelations($id);

        if (!$user) {
            return null;
        }

        if (!$user->profile_picture) {
            $user->profile_picture = self::DEFAULT_PROFILE_PICTURE;
        }

        return $user;
    }

    public function update($user, Request $request)
    {
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

        $this->repo->update($user, $validated);

        return $user;
    }

    public function delete($requestUser, $id)
    {
        $user = $this->repo->find($id);

        if ($requestUser->id !== $user->id) {
            return false;
        }

        $this->repo->delete($id);

        return true;
    }

    public function updateProfilePicture($user, Request $request)
    {
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

        return $user;
    }
}
