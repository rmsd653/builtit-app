<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    private function createNotifications(User $user, int $count)
    {
        for ($i = 0; $i < $count; $i++) {
            $user->notifications()->create([
                'id' => Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'data' => ['message' => 'Test'],
                'read_at' => null,
            ]);
        }
    }

    public function test_can_get_notifications()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->createNotifications($user, 3);

        $response = $this->getJson('/api/notifications');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_mark_notification_as_read()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->createNotifications($user, 1);
        $notification = $user->notifications()->first();

        $response = $this->patchJson("/api/notifications/{$notification->id}/read");

        $response->assertStatus(200);
        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_can_mark_all_notifications_as_read()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->createNotifications($user, 3);

        $response = $this->patchJson('/api/notifications/read-all');

        $response->assertStatus(200)
            ->assertJson(['message' => 'All marked as read']);

        $this->assertEquals(0, $user->unreadNotifications()->count());
    }
}
