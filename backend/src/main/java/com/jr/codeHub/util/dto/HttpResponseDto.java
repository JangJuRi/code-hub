package com.jr.codeHub.util.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class HttpResponseDto {
    private Integer code;
    private Map data;

    public HttpResponseDto(Integer code, Map data) {
        this.code = code;
        this.data = data;
    }
}
