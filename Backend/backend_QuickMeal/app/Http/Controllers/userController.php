<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
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
                'regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/'
            ],

            'password' => 'required|string|min:8|confirmed',
        ]);

        // Lowercase email
        $validated['email'] = strtolower($validated['email']);

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        // Default premium status
        $validated['is_premium'] = false;

        // Create user
        $user = User::create($validated);

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
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
                'regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/'
            ],

            'password' => 'required|string'
        ]);

        // Lowercase email
        $validated['email'] = strtolower($validated['email']);

        // Find user
        $user = User::where('email', $validated['email'])->first();

        // Check password
        if (!$user || !Hash::check($validated['password'], $user->password)) {

            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    /**
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ], 200);
    }

    /**
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * GET /api/users
     * Get ALL users with all columns
     */
    public function index()
    {
        $users = User::all();

        return response()->json([
            'success' => true,
            'count' => $users->count(),
            'data' => $users
        ], 200);
    }

    /**
     * GET /api/users/{id}
     * Get single user
     */
    public function show($id)
    {
        $user = User::with([
            'orders',
            'recommendations',
            'subscriptions'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user
        ], 200);
    }

    /**
     * PUT /api/user
     * Update current logged-in user
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
                'regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/'
            ],

            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        // Lowercase email
        if (isset($validated['email'])) {
            $validated['email'] = strtolower($validated['email']);
        }

        // Hash password
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Update user
        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ], 200);
    }

    /**
     * DELETE /api/users/{id}
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Authorization check
        if ($request->user()->id !== $user->id) {

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Delete user
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ], 200);
    }
}