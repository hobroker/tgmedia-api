<script>
  import CircularProgress from '@smui/circular-progress';
  import { prop } from 'ramda';
  import Movies from './components/Movies.svelte';

  let movies;

  fetch('/v1/radarr')
    .then((response) => response.json())
    .then((response) => {
      movies = response.filter(prop('movieFile'));
    });
</script>

<main>
  {#if movies}
    <Movies {movies} />
  {:else}
    <div style="display: flex; justify-content: center">
      <CircularProgress style="height: 32px; width: 32px;" indeterminate />
    </div>
  {/if}
</main>
