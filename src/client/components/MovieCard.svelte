<script>
  import Card, {
    Content,
    PrimaryAction,
    Media,
    Actions,
    ActionButtons,
  } from '@smui/card';
  import Button, { Label } from '@smui/button';

  export let url;
  export let title = '';
  export let description = '';
  export let id = '';

  const onButtonClick = () => {
    fetch(`/v1/messenger/${id}`);
  };
</script>

<Card style="height: 100%">
  <PrimaryAction>
    <Media aspectRatio="square" style="background-image: url({url});" />
    <Content class="mdc-typography--body2">
      <h2 class="mdc-typography--headline6" style="margin: 0;">
        {title}
      </h2>
      {description}
    </Content>
  </PrimaryAction>
  <Actions style="margin-top: auto">
    <ActionButtons>
      <Button on:click={onButtonClick} variant="raised">
        <Label>Send</Label>
      </Button>
    </ActionButtons>
  </Actions>
</Card>
