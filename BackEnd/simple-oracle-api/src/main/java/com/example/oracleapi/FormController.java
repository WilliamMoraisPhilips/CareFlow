package com.example.oracleapi;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/submit-form")
public class FormController {

    @Autowired
    private ProcedureService procedureService;

    @PostMapping("/profissionais")
    public void submitForm(@RequestBody FormDataDTO formData) {
        procedureService.insertProfessional(formData);
    }

    // @PostMapping("/profissionais")
    // public void inserirProfissional(@RequestBody ProfissionalDTO profissionalDTO)
    // throws SQLException {
    // service.inserirProfissional(profissionalDTO);
    // }

}