<script>
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import { propEq } from 'ramda';
  import { CoverType } from '@jc21/radarr-api/lib/models/enums/CoverType';
  import MovieCard from './MovieCard.svelte';

  export let movies = [];
</script>

<main>
  <LayoutGrid>
    {#each movies as movie, i}
      <Cell>
        <MovieCard
          id={movie.id}
          url={movie.images.find(propEq('coverType', CoverType.Poster))
            .remoteUrl}
          title={movie.title}
          description={movie.overview}
        />
      </Cell>
    {/each}
  </LayoutGrid>
</main>
