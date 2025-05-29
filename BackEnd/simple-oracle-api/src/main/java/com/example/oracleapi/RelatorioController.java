package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
@RestController
@RequestMapping("/api")
public class RelatorioController {

    private final RelatorioService relatorioService;
    private final ProfissionalService profissionalService;

    @Autowired
    public RelatorioController(RelatorioService relatorioService, ProfissionalService profissionalService) {
        this.relatorioService = relatorioService;
        this.profissionalService = profissionalService;
    }

    @GetMapping("/relatorio/{id}")
    public RelatorioDTO getRelatorio(@PathVariable Long id) throws SQLException {
        return relatorioService.getRelatorioPorId(id);
    }

    @GetMapping("/profissional/setores")
    public List<Map<String, Object>> listarSetores() throws SQLException {
        return profissionalService.obterSetores();
    }

    @GetMapping("/profissional/cargos")
    public List<Map<String, Object>> listarCargos() throws SQLException {
        return profissionalService.obterCargos();
    }

    @GetMapping("/profissional/niveis-de-acesso")
    public List<Map<String, Object>> listarNiveisDeAcesso() throws SQLException {
        return profissionalService.obterNiveisDeAcesso();
    }

    @GetMapping("/profissional/formacao")
    public List<Map<String, Object>> listarFormacao() throws SQLException {
        return profissionalService.obterFormacao();
    }

    @GetMapping("/profissional/jornadas")
    public List<Map<String, Object>> listarJornadas() throws SQLException {
        return profissionalService.obterJornadas();
    }

    @GetMapping("/profissional/contratos")
    public List<Map<String, Object>> listarContratos() throws SQLException {
        return profissionalService.obterContratos();
    }

    @GetMapping("/profissional/bairros")
    public List<Map<String, Object>> listarBairros() throws SQLException {
        return profissionalService.obterBairros();
    }

    // @GetMapping("/profissional/municipios")
    // public List<Map<String, Object>> listarMunicipios() throws SQLException {
    //     return profissionalService.obterMunicipios();
    // }

    // @GetMapping("/profissional/ufs")
    // public List<Map<String, Object>> listarUfs() throws SQLException {
    //     return profissionalService.obterUfs();
    // }
}
