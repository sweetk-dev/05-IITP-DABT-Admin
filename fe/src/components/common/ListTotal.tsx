import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useState, useEffect } from 'react';

interface ListTotalProps {
  total?: number;
  align?: 'left' | 'right';
  selectable?: {
    enabled: boolean;
    items: any[];
    getId: (item: any) => number | string;
    onSelectionChange: (selected: (number | string)[]) => void;
    renderCheckbox?: boolean;
    selectedIds?: (number | string)[]; // 외부에서 선택 상태를 받을 수 있도록
  };
}

export default function ListTotal({ total = 0, align = 'right', selectable }: ListTotalProps) {
  // admin 화면 (체크박스가 있는 경우)
  if (selectable?.enabled) {
    // 외부에서 전달받은 선택 상태를 사용하거나, 내부 상태로 관리
    const [internalSelectedIds, setInternalSelectedIds] = useState<(number | string)[]>([]);
    const selectedIds = selectable.selectedIds || internalSelectedIds;
    
    // selectable.items가 변경될 때마다 선택 상태 초기화
    useEffect(() => {
      setInternalSelectedIds([]);
    }, [selectable.items]);
    
    // 전체 선택/해제 핸들러
    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        // 모든 아이템 선택
        const allIds = selectable.items.map(selectable.getId);
        setInternalSelectedIds(allIds);
        selectable.onSelectionChange(allIds);
      } else {
        // 모든 아이템 해제
        setInternalSelectedIds([]);
        selectable.onSelectionChange([]);
      }
    };
    
    // 외부에서 선택 상태가 변경될 때 내부 상태 동기화
    useEffect(() => {
      if (selectable.selectedIds) {
        setInternalSelectedIds(selectable.selectedIds);
      }
    }, [selectable.selectedIds]);

    // 체크박스 상태 계산
    const isAllSelected = selectedIds.length > 0 && selectedIds.length === selectable.items.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < selectable.items.length;

    // 동적 라벨 생성
    const getSelectAllLabel = () => {
      if (selectedIds.length === 0) {
        return "전체 선택";
      } else if (selectedIds.length === selectable.items.length) {
        return "전체 해제";
      } else {
        return `전체 선택 (${selectedIds.length}/${selectable.items.length})`;
      }
    };

    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1 
      }}>
        {/* 전체 선택 체크박스 (왼쪽) */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(e) => handleSelectAll(e.target.checked)}
              size="small"
            />
          }
          label={getSelectAllLabel()}
          sx={{ 
            fontSize: '0.875rem',
            '& .MuiFormControlLabel-label': {
              fontSize: '0.875rem',
              fontWeight: 500
            }
          }}
        />
        
        {/* 총건수 (오른쪽) */}
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          총 {Number(total || 0).toLocaleString()}건
        </Typography>
      </Box>
    );
  }

  // 일반 화면 (기존 방식)
  return (
    <Box sx={{ display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', mb: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        총 {Number(total || 0).toLocaleString()}건
      </Typography>
    </Box>
  );
}


