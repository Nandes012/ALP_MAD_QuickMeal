<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Models\tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    use ApiResponses;

    /**
     * GET /api/tags
     * Get all tags, optionally filtered by type (recipe or bahan)
     */
    public function index(Request $request)
    {
        $type = $request->query('type');

        $query = tag::query();

        if ($type) {
            $query->where('type', $type);
        }

        $tags = $query->get()->map(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name,
                'icon' => $tag->icon,
                'type' => $tag->type,
            ];
        });

        return $this->successResponse($tags, 'Tags fetched successfully');
    }

    /**
     * GET /api/tags/{id}
     * Get a specific tag by ID
     */
    public function show($id)
    {
        $tag = tag::find($id);

        if (!$tag) {
            return $this->notFoundResponse('Tag');
        }

        $tagData = [
            'id' => $tag->id,
            'name' => $tag->name,
            'icon' => $tag->icon,
            'type' => $tag->type,
        ];

        return $this->successResponse($tagData, 'Tag fetched successfully');
    }
}
