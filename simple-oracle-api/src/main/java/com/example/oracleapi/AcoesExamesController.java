package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AcoesExamesController {

    @Autowired
    private AcoesExamesService service;

    @GetMapping("/acoes-exames")
    public List<Map<String, Object>> getAcoesExames() throws SQLException {
        return service.buscarAcoesExames();
    }
	
	// Criar novo
	@PostMapping("/acoes-exames")
	public AcaoExameDTO criar(@RequestBody AcaoExameDTO dto) throws SQLException {
		return service.inserirAcao(dto);
	}

	// Buscar por ID
	@GetMapping("/acoes-exames/{id}")
	public AcaoExameDTO buscar(@PathVariable int id) throws SQLException {
		return service.buscarPorId(id);
	}

	// Atualizar
	@PutMapping("/acoes-exames/{id}")
	public AcaoExameDTO atualizar(@PathVariable int id, @RequestBody AcaoExameDTO dto) throws SQLException {
		return service.atualizarAcao(id, dto);
	}

	// Deletar
	@DeleteMapping("/acoes-exames/{id}")
	public void deletar(@PathVariable int id) throws SQLException {
		service.deletarAcao(id);
	}
	
}
