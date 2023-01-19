<script>
  import { findStore } from '$lib/stores/newStore';
  import { get } from 'svelte/store';

  // props
  export let nodeId;
  export let canvasId;

  const { nodesStore, edgesStore, anchorsStore, onMouseMove } =
    findStore(canvasId);

  let node;
  $: node = $nodesStore[nodeId];
  console.log(nodeId);

  let isSelected = false;
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (isSelected) {
      onMouseMove(e, node.id);
    }
  }}
  on:mouseup={(e) => {
    // in theory, the mouse should always stay within the component and never go outside so this is unnecessary
    // in practice, there may be a bug and the cursor may leave the component while moving it, and then the
    // mouseup event won't be detected
    isSelected = false;
  }}
/>

<div
  on:mousedown={(e) => {
    isSelected = true;
    // $nodeIdSelected = node.id;
    // $nodeSelected = true;
  }}
  on:mouseup={(e) => {
    isSelected = false;
  }}
  style="left: {node.positionX}px;
    top: {node.positionY}px;
    width: {node.width}px;
    height: {node.height}px;
    background-color: black;
    position: absolute;
"
/>
