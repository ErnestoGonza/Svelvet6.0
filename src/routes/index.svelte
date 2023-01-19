<script>
  //   import Svelvet from '$lib/Containers/Svelvet/index.svelte'
  import Canvas from '../devTools/components/Canvas.svelte';
  const initialNodes = [
    {
      id: 1,
      type: 'input',
      position: { x: 0, y: 0 },
      data: { label: '1' },
      width: 175,
      height: 40,
      bgColor: 'white',
      sourcePosition: 'bottom',
    },
    {
      id: 2,
      type: 'default',
      position: { x: 0, y: 150 },
      data: { label: '2' },
      width: 175,
      height: 40,
      bgColor: 'white',
      sourcePosition: 'right',
      targetPositon: 'top',
    },
  ];
  const initialEdges = [
    { id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'e1-2' },
  ];
</script>

<!-- <Svelvet nodes={initialNodes} edges={initialEdges} width={900} height={900} background /> -->
<Canvas nodes={initialNodes} edges={initialEdges} />
