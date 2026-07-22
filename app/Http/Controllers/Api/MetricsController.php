<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MetricsService;
use Illuminate\Http\Request;

class MetricsController extends Controller
{
    public function __construct(
        private readonly MetricsService $metricsService
    ) {}

    public function overview(Request $request)
    {
        $from = $request->get('from', today()->subDays(30));
        $to = $request->get('to', today());

        return response()->json(
            $this->metricsService->getOverviewMetrics($from, $to)
        );
    }

    public function employees(Request $request)
    {
        $from = $request->get('from', today()->subDays(30));
        $to = $request->get('to', today());

        $users = User::all();
        
        $result = $users->map(function ($u) use ($from, $to) {
            return array_merge([
                'id' => $u->id,
                'name' => $u->name,
                'role' => $u->display_role ?: ($u->system_role?->value ?? 'employee')
            ], $this->metricsService->getEmployeeMetrics($u, $from, $to));
        });

        return response()->json($result);
    }

    public function volume(Request $request)
    {
        $from = $request->get('from', today()->subDays(30));
        $to = $request->get('to', today());

        return response()->json(
            $this->metricsService->getStatusDistribution($from, $to)
        );
    }

    public function distribution(Request $request)
    {
        $from = $request->get('from', today()->subDays(30));
        $to = $request->get('to', today());

        return response()->json(
            $this->metricsService->getStatusDistribution($from, $to)
        );
    }
}
