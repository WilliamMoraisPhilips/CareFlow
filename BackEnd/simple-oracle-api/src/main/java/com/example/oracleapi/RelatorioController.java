package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api")
public class RelatorioController {

    @Autowired
    private RelatorioService service;

    public RelatorioController(RelatorioService service) {
        this.service = service;
    }

    @GetMapping("/relatorio/{id}")
    public RelatorioDTO getRelatorio(@PathVariable Long id) throws SQLException {
        return service.getRelatorioPorId(id);
    }
}