<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponses;

    public function __construct(private readonly UserService $userService)
    {
    }

    /**
     * POST /api/auth/register
     */
    public function register(Request $request)
    {
        $result = $this->userService->register($request);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $result['user'],
            'token' => $result['token'],
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $result = $this->userService->login($request);

        if ($result === null) {
            return $this->errorResponse('Invalid email or password', 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $result['user'],
            'token' => $result['token'],
        ], 200);
    }

    /**
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        $user = $this->userService->me($request->user());

        if (!$user) {
            return $this->unauthorizedResponse();
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

        $user = $this->userService->findCurrentUserDetails($authUser);

        if (!$user) {
            return $this->notFoundResponse('User');
        }

        return $this->successResponse($user);
    }

    private function usersListResponse(Request $request)
    {
        [$usersCollection, $paginator] = $this->userService->listUsers($request);

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
        $user = $this->userService->findById($id);

        if (!$user) {
            return $this->notFoundResponse('User');
        }

        return $this->successResponse($user);
    }

    /**
     * PUT /api/user
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $updated = $this->userService->update($user, $request);

        return $this->successResponse($updated, 'User updated successfully');
    }

    /**
     * DELETE /api/users/{id}
     */
    public function destroy(Request $request, $id)
    {
        $deleted = $this->userService->delete($request->user(), $id);

        if (!$deleted) {
            return $this->errorResponse('Unauthorized', 403);
        }

        return $this->successResponse(null, 'User deleted successfully');
    }

    /**
     * POST /api/profile/update-picture
     */
    public function updateProfilePicture(Request $request)
    {
        $user = $request->user();

        $updated = $this->userService->updateProfilePicture($user, $request);

        return $this->successResponse($updated, 'Profile picture updated successfully');
    }
}
