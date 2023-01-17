<script>

  import Svelvet from 'svelvet';

	const initialNodes = [
		{
			id: 1,
			type: 'input',
			position: { x: 0, y: 0 },
			data: { label: '1' },
			width: 175,
			height: 40,
			bgColor: 'white',
			sourcePosition: 'bottom'
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
			targetPositon: 'top'
		},
		{
			id: 3,
			type: 'default',
			position: { x: 200, y: 150 },
			data: { label: '3' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPositon: 'right',
			sourcePosition: 'left'
		},
	];
  const initialEdges = [
		{ id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'e1-2' },
		{ id: 'e1-3', source: 1, type: 'bezier', target: 3, label: 'e1-3' },
	];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} width={900} height={900} background />
