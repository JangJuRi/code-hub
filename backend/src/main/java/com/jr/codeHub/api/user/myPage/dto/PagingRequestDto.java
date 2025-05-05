package com.jr.codeHub.api.user.myPage.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PagingRequestDto {
    private Integer number;
    private Integer size;
    private String SearchText;
}
