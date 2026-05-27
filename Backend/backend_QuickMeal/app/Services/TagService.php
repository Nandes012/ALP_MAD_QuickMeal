<?php

namespace App\Services;

use App\Repositories\TagRepository;

class TagService
{
    public function __construct(private readonly TagRepository $repo)
    {
    }

    public function index(?string $type = null)
    {
        return $this->repo->index($type)->map(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name,
                'icon' => $tag->icon,
                'type' => $tag->type,
            ];
        });
    }
}
