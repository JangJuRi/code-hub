package com.jr.codeHub.api.user.myPage.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModalInputDto {
    private String text;

    public ModalInputDto(String text) {
        this.text = text;
    }
}
