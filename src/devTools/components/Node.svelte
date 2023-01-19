<script>
  import { findStore } from '$lib/stores/newStore';
  import { get } from 'svelte/store';

  // props
  export let nodeId;
  export let canvasId;

  const { nodesStore, edgesStore, anchorsStore, onMouseMove } =
    findStore(canvasId);

  const node = $nodesStore[nodeId];
  console.log(nodeId);
</script>

<div
  style="left: {node.positionX}px;
    top: {node.positionY}px;
    width: {node.width}px;
    height: {node.height}px;
    background-color: black;
    position: absolute;
"
/>
