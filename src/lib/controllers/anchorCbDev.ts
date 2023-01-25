import { v4 as uuidv4 } from 'uuid';
import { rightCb, leftCb, topCb, bottomCb } from './anchorCbUser'; // these are callbacks used to calculate anchor position relative to node
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
  UserNodeType,
  UserEdgeType,
} from '$lib/models/types';
import { ResizeNode } from '$lib/models/ResizeNode';
import { Anchor } from '$lib/models/Anchor';
import { Node } from '$lib/models/Node';
import { Edge } from '$lib/models/Edge';
import { writable, derived, get, readable } from 'svelte/store';
import {
  getNodes,
  getAnchors,
  getNodeById,
  getAnchorById,
  getEdgeById,
} from './storeApi';

export function fixedCbCreator(
  store: StoreType,
  edgeId: string,
  anchorId: string,
  userNodeId: string,
  positionCb: Function // positionCb should be a function that takes 4 arguments (x,y,width,height) and returns a 3-array [x,y,angle] that represents the x,y position of the anchor as well as it's angle with respect to it's node.
) {
  return fixedCb;

  function fixedCb() {
    // get the two anchors
    const anchors = getAnchors(store, { edgeId: edgeId });
    if (anchors.length !== 2) throw 'there should be two anchors per edge';
    let [anchorSelf, anchorOther] = anchors;
    if (anchorSelf.id !== anchorId)
      [anchorSelf, anchorOther] = [anchorOther, anchorSelf];

    const node = getNodeById(store, userNodeId);
    const { positionX, positionY, width, height } = node;
    const [x, y, angle] = positionCb(positionX, positionY, width, height);
    anchorSelf.positionX = x;
    anchorSelf.positionY = y;
    anchorSelf.angle = angle;
    // update the other anchor. This is in case the other anchor is a dynamic anchor
    // The dyanamic anchor has a check that prevents an infinite loop
    anchorOther.callback();
  }
}

export function dynamicCbCreator(
  store: StoreType,
  edgeId: string,
  anchorId: string
) {
  return dynamicCb;
  function dynamicCb() {
    // get the two anchors
    const anchors = getAnchors(store, { edgeId: edgeId });
    if (anchors.length !== 2) throw 'there should be two anchors per edge';
    let [anchorSelf, anchorOther] = anchors;
    if (anchorSelf.id !== anchorId)
      [anchorSelf, anchorOther] = [anchorOther, anchorSelf];
    // get the two nodes
    const nodeSelf = getNodeById(store, anchorSelf.nodeId);
    const nodeOther = getNodeById(store, anchorOther.nodeId);
    // get the midpoints
    const [xSelf, ySelf, xOther, yOther] = [
      nodeSelf.positionX + nodeSelf.width / 2,
      nodeSelf.positionY + nodeSelf.height / 2,
      nodeOther.positionX + nodeOther.width / 2,
      nodeOther.positionY + nodeOther.height / 2,
    ];

    // record angle for later. We use this so we don't have an infinite loop
    let prevAngle = anchorSelf.angle;

    // calculate the slope
    const slope = (ySelf - yOther) / (xSelf - xOther);
    // slope<1 means -45 to 45 degrees so left/right anchors
    if (Math.abs(slope) < 1) {
      // self node is on the left, other node is on the right
      if (nodeSelf.positionX < nodeOther.positionX) {
        const [selfX, selfY] = rightCb(
          nodeSelf.positionX,
          nodeSelf.positionY,
          nodeSelf.width,
          nodeSelf.height
        );
        const [otherX, otherY] = leftCb(
          nodeOther.positionX,
          nodeOther.positionY,
          nodeOther.width,
          nodeOther.height
        );
        anchorSelf.setPosition(selfX, selfY);
        anchorSelf.angle = 0; // if the self node is on the left, the anchor should have orientation of 0 degrees on the unit circle
      } else {
        // in this case, the self node is on the right and the other node is on the left
        const [selfX, selfY] = leftCb(
          nodeSelf.positionX,
          nodeSelf.positionY,
          nodeSelf.width,
          nodeSelf.height
        );
        const [otherX, otherY] = rightCb(
          nodeOther.positionX,
          nodeOther.positionY,
          nodeOther.width,
          nodeOther.height
        );
        anchorSelf.setPosition(selfX, selfY);
        anchorSelf.angle = 180;
      }
    } else {
      if (nodeSelf.positionY < nodeOther.positionY) {
        // here the self node is above the other node
        const [selfX, selfY] = bottomCb(
          nodeSelf.positionX,
          nodeSelf.positionY,
          nodeSelf.width,
          nodeSelf.height
        );
        const [otherX, otherY] = topCb(
          nodeOther.positionX,
          nodeOther.positionY,
          nodeOther.width,
          nodeOther.height
        );
        anchorSelf.setPosition(selfX, selfY);
        anchorSelf.angle = 270;
      } else {
        const [selfX, selfY] = topCb(
          nodeSelf.positionX,
          nodeSelf.positionY,
          nodeSelf.width,
          nodeSelf.height
        );
        const [otherX, otherY] = bottomCb(
          nodeOther.positionX,
          nodeOther.positionY,
          nodeOther.width,
          nodeOther.height
        );
        anchorSelf.setPosition(selfX, selfY);
        anchorSelf.angle = 90;
      }
    }

    // if the anchor changed position, then do operation for other anchor
    // otherwise, don't do anything. This check is so we don't have an infinite loop
    if (prevAngle !== anchorSelf.angle) anchorOther.callback();
  }
}