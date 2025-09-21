// 랜덤 레이아웃 생성 알고리즘 - 공통 모듈
import React from 'react';

export interface GridCell {
  id: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  size: 'small' | 'medium' | 'large' | 'hero';
  borderRadius: string;
  transform?: string;
  zIndex?: number;
}

export interface RandomLayout {
  gridRows: number;
  gridCols: number;
  cells: GridCell[];
}

// 시드 기반 랜덤 생성기 (일관된 랜덤 결과를 위해)
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.range(0, array.length - 1)];
  }
}

// 공간 최적화 랜덤 레이아웃 생성 알고리즘
export function generateRandomLayout(itemCount: number, idPrefix: string = 'item'): RandomLayout {
  const rng = new SeededRandom(itemCount * 42 + Date.now() % 1000);
  
  // 모든 아이템을 포함하는 최적 그리드 크기 계산 (최대 컬럼 수 제한)
  const calculateOptimalGrid = (count: number): { rows: number; cols: number } => {
    // 컬럼 수를 2~3으로 제한 (카드 크기 보장)
    const minCols = 2;
    const maxCols = 3;
    const maxRows = Math.ceil(count / minCols) + 2; // 충분한 행 수 보장
    
    const candidates = [];
    
    // 2~3 컬럼으로 후보 생성
    for (let cols = minCols; cols <= maxCols; cols++) {
      for (let rows = Math.ceil(count / cols); rows <= maxRows; rows++) {
        const totalCells = rows * cols;
        if (totalCells >= count) {
          const wastedCells = totalCells - count;
          const efficiency = count / totalCells;
          const wasteRatio = wastedCells / count;
          
          // 점수 계산: 효율성과 적당한 랜덤성
          const efficiencyScore = efficiency * 0.8;
          const wasteScore = Math.max(0, 1 - wasteRatio * 2) * 0.2;
          const randomScore = rng.next() * 0.1;
          
          candidates.push({ 
            rows, 
            cols, 
            totalCells,
            wastedCells,
            efficiency,
            score: efficiencyScore + wasteScore + randomScore
          });
        }
      }
    }
    
    if (candidates.length === 0) {
      // 폴백: 2 컬럼으로 필요한 행 계산
      const cols = 2;
      const rows = Math.ceil(count / cols);
      return { rows, cols };
    }
    
    // 점수순 정렬하여 상위 후보들 중에서 선택
    candidates.sort((a, b) => b.score - a.score);
    const topCandidates = candidates.slice(0, Math.min(3, candidates.length));
    const selected = rng.choice(topCandidates);
    
    return { rows: selected.rows, cols: selected.cols };
  };

  const { rows: gridRows, cols: gridCols } = calculateOptimalGrid(itemCount);
  const totalGridCells = gridRows * gridCols;

  // 그리드 점유 맵과 셀 배열 생성
  const occupiedGrid: boolean[][] = Array(gridRows).fill(null).map(() => Array(gridCols).fill(false));
  const cells: GridCell[] = [];

  // 스타일 옵션들
  const borderRadiusOptions = [
    '24px', '8px 24px 8px 24px', '24px 8px 24px 8px',
    '24px 24px 8px 8px', '8px 8px 24px 24px', '24px 8px 8px 8px',
    '8px 24px 8px 8px', '8px 8px 24px 8px', '8px 8px 8px 24px'
  ];

  const rotationOptions = [
    'none', 'rotate(-2deg)', 'rotate(-1deg)', 'rotate(-0.5deg)',
    'rotate(0.5deg)', 'rotate(1deg)', 'rotate(2deg)'
  ];

  // 모든 아이템을 포함하여 공간을 채우는 크기 결정 알고리즘
  const planCellSizes = (itemCount: number, totalCells: number): Array<{ size: string; rowSpan: number; colSpan: number; itemIndex: number }> => {
    const plans: Array<{ size: string; rowSpan: number; colSpan: number; itemIndex: number }> = [];
    const extraCells = totalCells - itemCount;
    
    // 1단계: 모든 아이템을 기본 1x1로 시작
    for (let i = 0; i < itemCount; i++) {
      plans.push({ 
        size: 'small', 
        rowSpan: 1, 
        colSpan: 1, 
        itemIndex: i 
      });
    }
    
    // 2단계: 빈 공간을 활용해서 일부 카드들을 확장
    let remainingExtraCells = extraCells;
    
    // 히어로 카드 생성 (첫 번째 아이템을 확률적으로)
    if (itemCount > 0 && remainingExtraCells >= 3 && rng.next() < 0.7) {
      const heroIndex = 0;
      const maxExpansion = Math.min(4, remainingExtraCells + 1);
      
      if (maxExpansion >= 3) {
        const expansionOptions = [
          { rowSpan: 2, colSpan: 2, extraCells: 3 },
          { rowSpan: 2, colSpan: 3, extraCells: 5 },
          { rowSpan: 3, colSpan: 2, extraCells: 5 },
        ].filter(option => option.extraCells <= remainingExtraCells);
        
        if (expansionOptions.length > 0) {
          const chosen = rng.choice(expansionOptions);
          plans[heroIndex] = { 
            size: 'hero', 
            rowSpan: chosen.rowSpan, 
            colSpan: chosen.colSpan, 
            itemIndex: heroIndex 
          };
          remainingExtraCells -= chosen.extraCells;
        }
      }
    }
    
    // 3단계: 남은 빈 공간으로 다른 카드들 확장
    const expandableIndices = plans
      .map((_, index) => index)
      .filter(index => plans[index].size !== 'hero')
      .sort(() => rng.next() - 0.5);
    
    for (const index of expandableIndices) {
      if (remainingExtraCells <= 0) break;
      
      const expansionOptions = [
        { rowSpan: 1, colSpan: 2, extraCells: 1, size: 'medium' },
        { rowSpan: 2, colSpan: 1, extraCells: 1, size: 'medium' },
        { rowSpan: 2, colSpan: 2, extraCells: 3, size: 'large' },
      ].filter(option => option.extraCells <= remainingExtraCells);
      
      if (expansionOptions.length > 0 && rng.next() < 0.6) {
        const chosen = rng.choice(expansionOptions);
        plans[index] = { 
          size: chosen.size, 
          rowSpan: chosen.rowSpan, 
          colSpan: chosen.colSpan, 
          itemIndex: plans[index].itemIndex 
        };
        remainingExtraCells -= chosen.extraCells;
      }
    }
    
    // 4단계: 아직도 빈 공간이 있으면 기존 카드들을 더 확장
    while (remainingExtraCells > 0) {
      const expandableCards = plans.filter(plan => 
        (plan.rowSpan < 3 || plan.colSpan < 3) && plan.size !== 'small'
      );
      
      if (expandableCards.length === 0) break;
      
      const cardToExpand = rng.choice(expandableCards);
      const cardIndex = plans.indexOf(cardToExpand);
      
      if (rng.next() < 0.5 && cardToExpand.colSpan < 3) {
        plans[cardIndex].colSpan += 1;
      } else if (cardToExpand.rowSpan < 3) {
        plans[cardIndex].rowSpan += 1;
      } else if (cardToExpand.colSpan < 3) {
        plans[cardIndex].colSpan += 1;
      } else {
        break;
      }
      
      remainingExtraCells -= 1;
      
      const totalSize = plans[cardIndex].rowSpan * plans[cardIndex].colSpan;
      if (totalSize >= 6) {
        plans[cardIndex].size = 'hero';
      } else if (totalSize >= 4) {
        plans[cardIndex].size = 'large';
      } else if (totalSize >= 2) {
        plans[cardIndex].size = 'medium';
      }
    }
    
    return plans;
  };

  // 안정적인 배치 알고리즘 (모든 아이템 보장)
  const intelligentPlace = (plans: Array<{ size: string; rowSpan: number; colSpan: number; itemIndex: number }>): void => {
    const sortedPlans = [...plans].sort((a, b) => (b.rowSpan * b.colSpan) - (a.rowSpan * a.colSpan));
    
    for (const plan of sortedPlans) {
      let currentPlan = { ...plan };
      let placed = false;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!placed && attempts < maxAttempts) {
        for (let row = 0; row <= gridRows - currentPlan.rowSpan && !placed; row++) {
          for (let col = 0; col <= gridCols - currentPlan.colSpan && !placed; col++) {
            if (canPlaceCell(row, col, currentPlan.rowSpan, currentPlan.colSpan)) {
              placeCell(row, col, currentPlan.rowSpan, currentPlan.colSpan);
              
              cells.push({
                id: `${idPrefix}${plan.itemIndex}`,
                row: row + 1,
                col: col + 1,
                rowSpan: currentPlan.rowSpan,
                colSpan: currentPlan.colSpan,
                size: currentPlan.size as any,
                borderRadius: rng.choice(borderRadiusOptions),
                transform: rng.choice(rotationOptions) === 'none' ? undefined : rng.choice(rotationOptions),
                zIndex: currentPlan.size === 'hero' ? 2 : 1
              });
              
              placed = true;
            }
          }
        }
        
        if (!placed) {
          attempts++;
          if (currentPlan.rowSpan > 1 && currentPlan.colSpan > 1) {
            if (rng.next() < 0.5) {
              currentPlan.rowSpan = Math.max(1, currentPlan.rowSpan - 1);
            } else {
              currentPlan.colSpan = Math.max(1, currentPlan.colSpan - 1);
            }
            
            const totalSize = currentPlan.rowSpan * currentPlan.colSpan;
            if (totalSize >= 6) {
              currentPlan.size = 'hero';
            } else if (totalSize >= 4) {
              currentPlan.size = 'large';
            } else if (totalSize >= 2) {
              currentPlan.size = 'medium';
            } else {
              currentPlan.size = 'small';
            }
          } else if (currentPlan.rowSpan > 1) {
            currentPlan.rowSpan = 1;
            currentPlan.size = currentPlan.colSpan > 1 ? 'medium' : 'small';
          } else if (currentPlan.colSpan > 1) {
            currentPlan.colSpan = 1;
            currentPlan.size = 'small';
          } else {
            break;
          }
        }
      }
      
      if (!placed) {
        console.warn(`Force placing ${idPrefix} ${plan.itemIndex} as 1x1`);
        let forcePlace = false;
        
        for (let row = 0; row < gridRows && !forcePlace; row++) {
          for (let col = 0; col < gridCols && !forcePlace; col++) {
            if (!occupiedGrid[row][col]) {
              occupiedGrid[row][col] = true;
              
              cells.push({
                id: `${idPrefix}${plan.itemIndex}`,
                row: row + 1,
                col: col + 1,
                rowSpan: 1,
                colSpan: 1,
                size: 'small',
                borderRadius: rng.choice(borderRadiusOptions),
                transform: rng.choice(rotationOptions) === 'none' ? undefined : rng.choice(rotationOptions),
                zIndex: 1
              });
              
              forcePlace = true;
            }
          }
        }
        
        if (!forcePlace) {
          console.warn(`Overlay placing ${idPrefix} ${plan.itemIndex}`);
          cells.push({
            id: `${idPrefix}${plan.itemIndex}`,
            row: 1,
            col: 1,
            rowSpan: 1,
            colSpan: 1,
            size: 'small',
            borderRadius: rng.choice(borderRadiusOptions),
            transform: `translate(${plan.itemIndex * 15}px, ${plan.itemIndex * 15}px) scale(0.9)`,
            zIndex: 10 + plan.itemIndex
          });
        }
      }
    }
  };

  // 유틸리티 함수들
  const canPlaceCell = (row: number, col: number, rowSpan: number, colSpan: number): boolean => {
    if (row + rowSpan > gridRows || col + colSpan > gridCols) return false;
    
    for (let r = row; r < row + rowSpan; r++) {
      for (let c = col; c < col + colSpan; c++) {
        if (occupiedGrid[r][c]) return false;
      }
    }
    return true;
  };

  const placeCell = (row: number, col: number, rowSpan: number, colSpan: number): void => {
    for (let r = row; r < row + rowSpan; r++) {
      for (let c = col; c < col + colSpan; c++) {
        occupiedGrid[r][c] = true;
      }
    }
  };

  // 실행
  const cellPlans = planCellSizes(itemCount, totalGridCells);
  intelligentPlace(cellPlans);
  
  // 누락된 아이템들을 강제로 배치
  if (cells.length !== itemCount) {
    console.warn(`Expected ${itemCount} items, but only ${cells.length} were placed`);
    
    const placedItemIndices = new Set(cells.map(cell => parseInt(cell.id.replace(idPrefix, ''))));
    
    for (let i = 0; i < itemCount; i++) {
      if (!placedItemIndices.has(i)) {
        let placed = false;
        for (let row = 0; row < gridRows && !placed; row++) {
          for (let col = 0; col < gridCols && !placed; col++) {
            if (canPlaceCell(row, col, 1, 1)) {
              placeCell(row, col, 1, 1);
              
              cells.push({
                id: `${idPrefix}${i}`,
                row: row + 1,
                col: col + 1,
                rowSpan: 1,
                colSpan: 1,
                size: 'small',
                borderRadius: rng.choice(borderRadiusOptions),
                transform: rng.choice(rotationOptions) === 'none' ? undefined : rng.choice(rotationOptions),
                zIndex: 1
              });
              
              placed = true;
            }
          }
        }
        
        if (!placed) {
          cells.push({
            id: `${idPrefix}${i}`,
            row: 1,
            col: 1,
            rowSpan: 1,
            colSpan: 1,
            size: 'small',
            borderRadius: rng.choice(borderRadiusOptions),
            transform: `translate(${(i % 3) * 20}px, ${(i % 3) * 20}px) scale(0.8)`,
            zIndex: 10 + i
          });
        }
      }
    }
  }

  return { gridRows, gridCols, cells };
}

// 아이콘 선택 알고리즘
export function getItemIcon(index: number, itemCount: number): React.ReactElement {
  const icons = [
    <path key="layers" d="M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12" strokeWidth="2" fill="none" />,
    <path key="document" d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z M14 2V8H20 M16 13H8 M16 17H8 M10 9H8" strokeWidth="2" fill="none" />,
    <path key="folder" d="M9 11H15 M9 15H15 M17 21L12 16L7 21 M3 5A2 2 0 0 1 5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5Z" strokeWidth="2" fill="none" />,
    <path key="star" d="M12 6.253V10L16.5 8L18 12L22.5 10.5L18.5 14L22 18L17 20L13 16L8.5 20L4 18L8 14L4 10.5L8.5 12L10 8L14.5 10L12 6.253Z" strokeWidth="2" fill="none" />,
    <path key="code" d="M16 18L22 12L16 6 M8 6L2 12L8 18" strokeWidth="2" fill="none" />,
    <path key="book" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4H20V17H6.5A2.5 2.5 0 0 0 4 19.5Z M20 4V17" strokeWidth="2" fill="none" />,
    <path key="terminal" d="M4 17L10 11L4 5 M12 19H20" strokeWidth="2" fill="none" />,
    <path key="grid" d="M3 3H10V10H3V3Z M14 3H21V10H14V3Z M14 14H21V21H14V14Z M3 14H10V21H3V14Z" strokeWidth="2" fill="none" />,
    <path key="edit" d="M11 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H16A2 2 0 0 0 18 18V11 M18.5 2.5A2.121 2.121 0 0 1 21 4.621L19.379 6.243L17.757 4.621L18.5 2.5Z M17.757 4.621L6 16.243V18H7.757L19.379 6.243L17.757 4.621Z" strokeWidth="2" fill="none" />,
    <path key="file" d="M13 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V9L13 2Z M13 2V9H20" strokeWidth="2" fill="none" />
  ];

  return icons[index % icons.length];
}
