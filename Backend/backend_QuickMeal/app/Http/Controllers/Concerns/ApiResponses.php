<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

trait ApiResponses
{
    protected function successResponse(mixed $data = null, ?string $message = null, int $status = 200, array $extra = [])
    {
        $payload = ['success' => true];

        if ($message !== null) {
            $payload['message'] = $message;
        }

        if ($data !== null) {
            $payload['data'] = $data;
        }

        if (!empty($extra)) {
            $payload = array_merge($payload, $extra);
        }

        return response()->json($payload, $status);
    }

    protected function errorResponse(string $message, int $status = 400, array $extra = [])
    {
        return response()->json(array_merge([
            'success' => false,
            'message' => $message,
        ], $extra), $status);
    }

    protected function notFoundResponse(string $resourceName)
    {
        return $this->errorResponse("{$resourceName} not found", 404);
    }

    protected function unauthorizedResponse()
    {
        return $this->errorResponse('Unauthenticated', 401);
    }

    protected function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
        ];
    }

    protected function paginateOrLimit(
        Builder $query,
        Request $request,
        int $defaultLimit = 100,
        int $defaultPerPage = 20
    ): array {
        if ($request->filled('page')) {
            $paginator = $query->paginate((int) $request->input('perPage', $defaultPerPage));

            return [collect($paginator->items()), $paginator];
        }

        return [$query->limit((int) $request->input('limit', $defaultLimit))->get(), null];
    }
}
