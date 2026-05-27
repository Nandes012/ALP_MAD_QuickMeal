<?php

namespace App\Repositories;

use App\Models\tag;

class TagRepository
{
    public function index(?string $type = null)
    {
        $query = tag::query();

        if ($type) {
            $query->where('type', $type);
        }

        return $query->get();
    }
}

