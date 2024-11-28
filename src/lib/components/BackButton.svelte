<script>
	import { ChevronLeft } from 'lucide-svelte';
</script>

<button
	class="btn"
	onclick={() => {
		history.back();
	}}
>
	<ChevronLeft size={16} />
	Back
</button>
