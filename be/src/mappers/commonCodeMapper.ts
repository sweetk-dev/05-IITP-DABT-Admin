import type { CommonCode, CommonCodeDetail } from '@iitp-dabt/common';
import type { SysCommonCode } from '../models/sysCommonCode';

function toIsoString(value?: Date | string | number): string | undefined {
	if (!value) return undefined;
	const d = value instanceof Date ? value : new Date(value);
	return d.toISOString();
}

export function toUserCommonCode(code: SysCommonCode): CommonCode {
	return {
		grpId: code.grpId,
		grpNm: code.grpNm,
		codeId: code.codeId,
		codeNm: code.codeNm,
		parentGrpId: code.parentGrpId,
		parentCodeId: code.parentCodeId,
		codeType: code.codeType as any,
		codeLvl: code.codeLvl,
		sortOrder: code.sortOrder,
		codeDes: code.codeDes
	};
}

export function toAdminCommonCodeDetail(code: SysCommonCode): CommonCodeDetail {
	return {
		grpId: code.grpId,
		grpNm: code.grpNm,
		codeId: code.codeId,
		codeNm: code.codeNm,
		parentGrpId: code.parentGrpId,
		parentCodeId: code.parentCodeId,
		codeType: code.codeType as any,
		codeLvl: code.codeLvl,
		sortOrder: code.sortOrder,
		useYn: code.useYn,
		delYn: code.delYn,
		codeDes: code.codeDes,
		memo: code.memo,
		createdAt: toIsoString(code.createdAt),
		updatedAt: toIsoString(code.updatedAt),
		deletedAt: toIsoString(code.deletedAt),
		createdBy: code.createdBy,
		updatedBy: code.updatedBy,
		deletedBy: code.deletedBy
	};
}


