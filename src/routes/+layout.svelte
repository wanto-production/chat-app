<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>main</title>
	<meta name="description" content="hello welcome to my chatapp!">
	<meta name="keywords" content="ikwan chatapp,ikhwan app">
</svelte:head>

{@render children()}
