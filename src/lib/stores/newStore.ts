import { writable, derived, get, readable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
// import type { Node, Edge } from '../types/types';
/**
 *  When a user install svelvet package into their repo and import Svelvet from Svelvet,
 *  To create a node, the user needs to provide the following information:
 *  [{id, position {x, y}, data, width, height, bgColor}, {}] all required
 *  The position x, y is for the left top corner of the node
 *
 *
 *  To create an edge, the user needs to provide the following information:
 *  {id, source, target} required
 *  {label, labelTextColor, labelBgColor, animate, type, arrow, edgeColor} optional
 *  For now, only focus on the required information for edges
 *
 *
 *  1. We do not want to change the information our user needs to provide to create a node or an edge
 *  2. Is it possible to do OOP for node and edge?
 *  3. Situations for node: Node created / Node moved / Node deleted
 *  4. Situations for edge: Edge created / Edge deleted
 *
 */

interface testingCoreStore {
  nodesStore: Writable<{ [key: string]: Node }>;
  edgesStore: Writable<{ [key: string]: Edge }>;
  anchorsStore: Writable<{ [key: string]: Anchor }>;
  onMouseMove: Function;
}

interface NodeType {
  id: string;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  bgColor: string;
  data: string;
}

interface EdgeType {
  id: string;
  type: string;
  targetId: number;
  sourceId: number;
}

interface AnchorType {
  id: string;
  nodeId: number;
  edgeId: number;
  sourceOrSink: string;
  getPosition: Function;
}

const svelvetStores: { [key: string]: any } = {};

export function findStore(key: string) {
  if (svelvetStores[key] === undefined)
    throw `key not found in svelvetStore: ${key}`;
  return svelvetStores[key];
}

/* 
   Creates a new store and puts in it svelvetStores
   Returns the new store
*/
export function createStore(key: string) {
  const nodesStore = writable({});
  const edgesStore = writable({});
  const anchorsStore = writable({});
  const onMouseMove = (e: any, nodeId: string) => {
    nodesStore.update((obj: { [key: string]: any }) => {
      obj[nodeId].positionX += e.movementX;
      obj[nodeId].positionY += e.movementY;
      return { ...obj }; // TODO: is this necessary?
    });
  };

  const testingCoreStore: testingCoreStore = {
    nodesStore,
    edgesStore,
    anchorsStore,
    onMouseMove,
  };

  svelvetStores[key] = testingCoreStore;
  return svelvetStores[key];
}

export class Edge implements EdgeType {
  id: string;
  sourceId: number;
  targetId: number;
  type: string;

  constructor(id: string, sourceId: number, targetId: number, type: string) {
    this.id = id;
    //surce is the id of the source node
    this.sourceId = sourceId;
    //target is the id of the target node
    this.targetId = targetId;
    this.type = type;
  }

  handleDelete() {
    console.log('Edge handleDelete fired');
  }
}

//refactore the nodeStore from array to object

export class Anchor implements AnchorType {
  id: string;
  nodeId: number;
  edgeId: number;
  sourceOrSink: string;
  getPosition: Function;

  constructor(
    id: string,
    nodeId: number,
    edgeId: number,
    sourceOrSink: string,
    getPosition = () => {
      //access the nodeStore[node_id]
      //will look up the node.positionX and node.positionY
      //will calculate X. Y position of the anchor
      console.log('Anchor getPosition fired');
    }
  ) {
    this.id = id;
    this.nodeId = nodeId;
    this.edgeId = edgeId;
    this.sourceOrSink = sourceOrSink;
    this.getPosition = getPosition;
  }
}

export class Node implements NodeType {
  id: string;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  bgColor: string;
  data: string;

  constructor(
    id: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number,
    bgColor: string,
    data: string
  ) {
    this.id = id;
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height;
    this.bgColor = bgColor;
    this.data = data;
  }

  setPosition(movementX: number, movementY: number) {
    //update all necessary data
    this.positionX += movementX;
    this.positionY += movementY;
    console.log('POSX: ', this.positionX);
    console.log('POSY: ', this.positionY);
  }

  handleDelete() {
    console.log('Node handleDelete fired');
  }
}
