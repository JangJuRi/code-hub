package com.jr.utilHub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "TABLE_UTIL_POST_LANGUAGE_TYPE")
public class UtilPostLanguageType {
    @Id
    private String languageType;

    private String color;
}
