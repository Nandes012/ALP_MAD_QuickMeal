<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Http\Request;

class UserRepository
{
    public function create(array $data)
    {
        return User::create($data);
    }

    public function findByEmail($email)
    {
        return User::where('email', $email)->first();
    }

    public function findWithRelations($id)
    {
        return User::with([
            'recentViewedRecipes',
            'recommendations',
            'subscriptions',
        ])->find($id);
    }

    public function paginateList(Request $request)
    {
        $page = $request->query('page');
        $perPage = (int) $request->query('perPage', 20);

        if ($page) {
            $paginator = User::paginate($perPage);
            return [collect($paginator->items()), $paginator];
        }

        return [User::limit((int) $request->query('limit', 100))->get(), null];
    }

    public function find($id)
    {
        return User::find($id);
    }

    public function update($user, array $data)
    {
        $user->update($data);
        return $user;
    }

    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
    }
}
