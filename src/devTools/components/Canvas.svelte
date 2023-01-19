<script>
  import { createStore, Node } from '$lib/stores/newStore';
  import { onMount } from 'svelte';
  import { v4 as uuid } from 'uuid';
  import { get } from 'svelte/store';
  // props
  export let nodes;
  export let edges;

  // Creates an empty store
  const { nodesStore, edgesStore, anchorsStore, onMouseMove } = createStore();

  // populate the store with user input
  onMount(() => {
    nodesStore.set(parseUserNodes(nodes));
    console.log($nodesStore);
    console.log(onMouseMove);
  });

  // this converts user input into a object of nodeTypes
  // we need to do this in order to put to user input into the store
  function parseUserNodes(nodes) {
    const res = {};
    for (let node of nodes) {
      const id = uuid();
      res[id] = new Node(
        id,
        node.position.x,
        node.position.y,
        node.width,
        node.height,
        node.bgColor,
        node.data // TODO: there is no type checking even though schema specified string and user gives object
      );
    }
    return res;
  }
</script>

{#each Object.entries($nodesStore) as entry}
  <div
    style="background-color:black; 
           width:{entry[1].width}px;
           height:{entry[1].height}px;
           position:absolute;
           top:{entry[1].positionY}px;
           left:{entry[1].positionX}px;"
  />
{/each}
