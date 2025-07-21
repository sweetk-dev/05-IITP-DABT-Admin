"use strict";
// FE/BE 공통 이메일/비밀번호 패턴 검증 유틸
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isValidPassword = isValidPassword;
function isValidEmail(email) {
    return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
}
function isValidPassword(password) {
    // 8자 이상, 영문/숫자/특수문자 포함
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}
