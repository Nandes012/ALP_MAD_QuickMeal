<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Services\TagService;
use Illuminate\Http\Request;

class TagController extends Controller
{
    use ApiResponses;

    public function __construct(private readonly TagService $tagService)
    {
    }

    /**
     * GET /api/tags
     * Get all tags, optionally filtered by type (recipe or bahan)
     */
    public function index(Request $request)
    {
        $tags = $this->tagService->index($request->query('type'));

        return $this->successResponse($tags, 'Tags fetched successfully');
    }
}
