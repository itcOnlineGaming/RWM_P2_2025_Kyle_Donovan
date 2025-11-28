<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { snackbar } from '$lib/snackbar/snackbarStore';
	import './page.css';

	function goToCalendar() {
		goto(`${base}/calendar`);
	}

	function goToNotifications() {
		goto(`${base}/notifications`);
	}
</script>

<div class="page-header">
	<div>
		<h1 class="page-title">📅 Calendar App</h1>
		<p class="page-description">Manage your schedule with notifications</p>
	</div>
</div>

<div class="content-grid">
	<!-- Welcome Card -->
	<div class="card featured-card">
		<div class="card-header">
			<div>
				<h2 class="card-title">Welcome to Your Calendar</h2>
				<p class="card-subtitle">Organize your events and receive notifications</p>
			</div>
			<span class="status-badge success">Ready</span>
		</div>

		<div class="card-body">
			<div class="feature-list">
				<div class="feature-item">
					<div class="feature-icon">📅</div>
					<div class="feature-content">
						<div class="feature-title">Manage Events</div>
						<div class="feature-desc">Create, edit, and organize your schedule</div>
					</div>
				</div>

				<div class="feature-item">
					<div class="feature-icon">🔔</div>
					<div class="feature-content">
						<div class="feature-title">Get Notifications</div>
						<div class="feature-desc">Desktop and mobile notifications for events</div>
					</div>
				</div>

				<div class="feature-item">
					<div class="feature-icon">💬</div>
					<div class="feature-content">
						<div class="feature-title">In-App Alerts</div>
						<div class="feature-desc">Snackbar notifications for quick feedback</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Navigation Card -->
	<div class="card">
		<div class="card-header">
			<h2 class="card-title">⚡ Quick Start</h2>
		</div>

		<div class="card-body">
			<div class="feature-list">
				<button class="feature-item" on:click={goToCalendar} style="border: none; background: none; cursor: pointer; padding: 0;">
					<div class="feature-icon">📆</div>
					<div class="feature-content">
						<div class="feature-title">View Calendar</div>
						<div class="feature-desc">Manage your events</div>
					</div>
					<div class="feature-arrow">→</div>
				</button>

				<button class="feature-item" on:click={goToNotifications} style="border: none; background: none; cursor: pointer; padding: 0;">
					<div class="feature-icon">🔔</div>
					<div class="feature-content">
						<div class="feature-title">Enable Notifications</div>
						<div class="feature-desc">Set up desktop alerts</div>
					</div>
					<div class="feature-arrow">→</div>
				</button>
			</div>
		</div>
	</div>

	<!-- Getting Started Card -->
	<div class="card">
		<div class="card-header">
			<h2 class="card-title">🚀 Getting Started</h2>
		</div>

		<div class="card-body">
			<div class="feature-list">
				<div class="feature-item">
					<div class="feature-icon">1️⃣</div>
					<div class="feature-content">
						<div class="feature-title">Create Events</div>
						<div class="feature-desc">Go to Calendar and click "New Event"</div>
					</div>
				</div>

				<div class="feature-item">
					<div class="feature-icon">2️⃣</div>
					<div class="feature-content">
						<div class="feature-title">Enable Notifications</div>
						<div class="feature-desc">Visit Notifications page to set up</div>
					</div>
				</div>

				<div class="feature-item">
					<div class="feature-icon">3️⃣</div>
					<div class="feature-content">
						<div class="feature-title">Stay Updated</div>
						<div class="feature-desc">Get alerts for your events</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background: linear-gradient(135deg, #f5f3ff 0%, #faf8fc 100%);
	}

	@import './page.css';
</style>
