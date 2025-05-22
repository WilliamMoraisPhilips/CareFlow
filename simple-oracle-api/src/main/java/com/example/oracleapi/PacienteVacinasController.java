package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PacienteVacinasController {

    @Autowired
    private PacienteVacinasService service;

    @GetMapping("/paciente-vacinas")
    public List<Map<String, Object>> getPacienteVacinas() throws SQLException {
        return service.buscarPacienteVacinas();
    }
}
