package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profissionais")
public class FormController {

    @Autowired
    private ProcedureService procedureService;

    @PostMapping
    public ResponseEntity<Void> submitForm(@RequestBody FormDataDTO formDataDTO) {
        procedureService.insertProfessional(formDataDTO);
        return ResponseEntity.ok().build();
    }
}