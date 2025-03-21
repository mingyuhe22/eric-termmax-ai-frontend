// components/range-order/EditModal/PositionEditModal.tsx
'use client'

import React from 'react'
import { Position } from '@/lib/mock/range-order-mock-data'
import EditModalContainer from './EditModalContainer'
import LendPositionEditor from './LendPositionEditor'
import BorrowPositionEditor from './BorrowPositionEditor'
import TwoWayPositionEditor from './TwoWayPositionEditor'

interface PositionEditModalProps {
  position: Position | null
  onClose: () => void
}

export default function PositionEditModal({ position, onClose }: PositionEditModalProps) {
  if (!position) return null;
  
  // Determine title based on position type
  const getModalTitle = () => {
    switch (position.orderType) {
      case 'Lend':
        return 'Edit Lend Position';
      case 'Borrow':
        return 'Edit Borrow Position';
      case 'Two Way':
        return 'Edit Two-Way Position';
      default:
        return 'Edit Position';
    }
  };
  
  // Render the appropriate editor based on position type
  const renderEditor = () => {
    switch (position.orderType) {
      case 'Lend':
        return <LendPositionEditor position={position} />;
      case 'Borrow':
        return <BorrowPositionEditor position={position} />;
      case 'Two Way':
        return <TwoWayPositionEditor position={position} />;
      default:
        return <div>Unknown position type</div>;
    }
  };
  
  return (
    <EditModalContainer
      position={position}
      onClose={onClose}
      title={getModalTitle()}
    >
      {renderEditor()}
    </EditModalContainer>
  );
}