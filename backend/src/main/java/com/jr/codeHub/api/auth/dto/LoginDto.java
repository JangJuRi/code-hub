package com.jr.codeHub.api.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {
    private String accountId;
    private String password;

    public LoginDto(String accountId, String password) {
        this.accountId = accountId;
        this.password = password;
    }
}
