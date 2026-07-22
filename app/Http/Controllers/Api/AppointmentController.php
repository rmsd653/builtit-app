<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReassignAppointmentRequest;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentStatusRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\User;
use App\Services\AppointmentService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Response;

class AppointmentController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly AppointmentService $appointmentService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Appointment::with(['visitor', 'host']);

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('host_id')) {
            $query->where('host_id', $request->host_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return AppointmentResource::collection($query->get());
    }

    public function store(StoreAppointmentRequest $request): \Illuminate\Http\JsonResponse|AppointmentResource
    {
        try {
            $appointment = $this->appointmentService->create($request->resolvedData(), $request->user());
            $appointment->load(['visitor', 'host']);
            return (new AppointmentResource($appointment))
                ->response()
                ->setStatusCode(201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show(Appointment $appointment): AppointmentResource
    {
        $appointment->load(['visitor', 'host']);
        return new AppointmentResource($appointment);
    }

    public function update(Request $request, Appointment $appointment): AppointmentResource
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'room' => 'sometimes|nullable|string',
            'is_private' => 'sometimes|boolean',
            'notes' => 'sometimes|nullable|string',
        ]);
        
        $appointment->update($data);
        return new AppointmentResource($appointment->load(['visitor', 'host']));
    }

    public function updateStatus(UpdateAppointmentStatusRequest $request, Appointment $appointment)
    {
        try {
            $this->appointmentService->updateStatus($appointment, $request->status, $request->user());
            return new AppointmentResource($appointment->load(['visitor', 'host']));
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function reassign(ReassignAppointmentRequest $request, Appointment $appointment)
    {
        try {
            $newHostId = $request->new_host_id ?? $request->host_id;
            $newHost = User::findOrFail($newHostId);
            $this->appointmentService->reassign($appointment, $newHost, $request->user());
            
            return new AppointmentResource($appointment->load(['visitor', 'host']));
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage(), 'errors' => $e->errors()], 422);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function updateAgenda(Request $request, Appointment $appointment): AppointmentResource
    {
        $this->authorize('updateAgenda', $appointment);
        $data = $request->validate(['agenda' => 'required|array']);
        
        $this->appointmentService->updateAgenda($appointment, $data['agenda']);
        return new AppointmentResource($appointment->load(['visitor', 'host']));
    }

    public function updateOutcome(Request $request, Appointment $appointment): AppointmentResource
    {
        $this->authorize('updateOutcome', $appointment);
        $data = $request->validate(['outcome' => 'required|array']);
        
        $this->appointmentService->updateOutcome($appointment, $data['outcome']);
        return new AppointmentResource($appointment->load(['visitor', 'host']));
    }

    public function destroy(Appointment $appointment): Response
    {
        $this->appointmentService->cancel($appointment, auth()->user());
        return response()->noContent();
    }
}
