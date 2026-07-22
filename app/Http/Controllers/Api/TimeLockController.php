<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTimeLockRequest;
use App\Http\Resources\TimeLockResource;
use App\Models\TimeLock;
use App\Models\User;
use App\Services\TimeLockService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TimeLockController extends Controller
{
    public function __construct(
        private readonly TimeLockService $timeLockService
    ) {}

    public function index(Request $request)
    {
        if ($request->has('date') && $request->has('user_id')) {
            $user = User::findOrFail($request->user_id);
            $locks = $this->timeLockService->getLocksForDate($user, $request->date);
            return TimeLockResource::collection($locks);
        }

        $userId = $request->user_id ?? $request->user()->id;
        $locks = TimeLock::where('user_id', $userId)->get();

        return TimeLockResource::collection($locks);
    }

    public function store(StoreTimeLockRequest $request)
    {
        $userId = $request->user_id ?? $request->user()->id;
        $user = User::findOrFail($userId);

        $lock = $this->timeLockService->createLock(
            $user,
            $request->validated(),
            $request->user()
        );

        return (new TimeLockResource($lock))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function destroy(TimeLock $timeLock)
    {
        \Illuminate\Support\Facades\Gate::authorize('delete', $timeLock);

        $this->timeLockService->deleteLock($timeLock);

        return response()->noContent();
    }
}
