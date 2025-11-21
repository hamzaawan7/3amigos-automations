<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PerformanceMilestone;
use App\Models\EmployeeReward;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MilestoneController extends Controller
{
    public function index()
    {
        $milestones = PerformanceMilestone::withCount('employeeRewards')
            ->orderBy('target_value', 'desc')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'description' => $m->description,
                'type' => $m->type,
                'target_value' => $m->target_value,
                'bonus_amount' => $m->bonus_amount,
                'currency' => $m->currency,
                'is_active' => $m->is_active,
                'icon' => $m->icon,
                'earned_count' => $m->employee_rewards_count,
            ]);

        return Inertia::render('Admin/Milestones/Index', [
            'milestones' => $milestones,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Milestones/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:streak,total_days,attendance_rate,on_time_rate',
            'target_value' => 'required|integer|min:1',
            'bonus_amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:10',
            'is_active' => 'boolean',
            'icon' => 'nullable|string|max:10',
        ]);

        PerformanceMilestone::create($validated);

        return redirect()->route('admin.milestones.index')
            ->with('success', 'Milestone created successfully!');
    }

    public function edit(PerformanceMilestone $milestone)
    {
        return Inertia::render('Admin/Milestones/Edit', [
            'milestone' => [
                'id' => $milestone->id,
                'name' => $milestone->name,
                'description' => $milestone->description,
                'type' => $milestone->type,
                'target_value' => $milestone->target_value,
                'bonus_amount' => $milestone->bonus_amount,
                'currency' => $milestone->currency,
                'is_active' => $milestone->is_active,
                'icon' => $milestone->icon,
            ],
        ]);
    }

    public function update(Request $request, PerformanceMilestone $milestone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:streak,total_days,attendance_rate,on_time_rate',
            'target_value' => 'required|integer|min:1',
            'bonus_amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:10',
            'is_active' => 'boolean',
            'icon' => 'nullable|string|max:10',
        ]);

        $milestone->update($validated);

        return redirect()->route('admin.milestones.index')
            ->with('success', 'Milestone updated successfully!');
    }

    public function destroy(PerformanceMilestone $milestone)
    {
        // Check if any employees have earned this milestone
        $earnedCount = $milestone->employeeRewards()->count();

        if ($earnedCount > 0) {
            return back()->with('error', "Cannot delete milestone. {$earnedCount} employee(s) have already earned it.");
        }

        $milestone->delete();

        return redirect()->route('admin.milestones.index')
            ->with('success', 'Milestone deleted successfully!');
    }

    public function toggle(PerformanceMilestone $milestone)
    {
        $milestone->update(['is_active' => !$milestone->is_active]);

        return back()->with('success', 'Milestone status updated!');
    }

    public function rewards()
    {
        $rewards = EmployeeReward::with(['employee', 'milestone'])
            ->orderBy('achieved_date', 'desc')
            ->paginate(20)
            ->through(fn($r) => [
                'id' => $r->id,
                'employee_name' => $r->employee->name,
                'milestone_name' => $r->milestone->name,
                'milestone_icon' => $r->milestone->icon,
                'bonus_amount' => $r->bonus_amount,
                'currency' => $r->currency,
                'achieved_value' => $r->achieved_value,
                'achieved_date' => $r->achieved_date->format('d M, Y'),
                'is_paid' => $r->is_paid,
                'paid_date' => $r->paid_date?->format('d M, Y'),
            ]);

        return Inertia::render('Admin/Milestones/Rewards', [
            'rewards' => $rewards,
        ]);
    }

    public function markPaid(EmployeeReward $reward)
    {
        $reward->update([
            'is_paid' => true,
            'paid_date' => now(),
        ]);

        return back()->with('success', 'Reward marked as paid!');
    }
}

