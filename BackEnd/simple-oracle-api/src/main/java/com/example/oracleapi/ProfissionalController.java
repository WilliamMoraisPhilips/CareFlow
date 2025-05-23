package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProfissionalController {

	@Autowired
	private ProfissionalService service;

	public ProfissionalController(ProfissionalService service) {
		this.service = service;
	}

	@PutMapping("/profissionais/{id}")
	public void atualizarProfissional(@PathVariable Long id, @RequestBody ProfissionalDTO profissionalDTO)
			throws SQLException {
		service.atualizarProfissional(id, profissionalDTO);
	}

	@PostMapping("/profissionais")
	public void inserirProfissional(@RequestBody ProfissionalDTO profissionalDTO) throws SQLException {
		service.inserirProfissional(profissionalDTO);
	}

	@GetMapping("/profissionais")
	public List<Map<String, Object>> getProfissionais() throws SQLException {
		return service.obterProfissionais();
	}

	// @GetMapping("/acoes-exames")
	// public List<Map<String, Object>> getAcoesExames() throws SQLException {
	// return service.buscarAcoesExames();
	// }

	// // Criar novo
	// @PostMapping("/profissionais")
	// public ProfissionalDTO criar(@RequestBody ProfissionalDTO dto) throws
	// SQLException {
	// return service.inserirAcao(dto);
	// }

	// // Buscar por ID
	// @GetMapping("/acoes-exames/{id}")
	// public ProfissionalDTO buscar(@PathVariable int id) throws SQLException {
	// return service.buscarPorId(id);
	// }

	// // Atualizar
	// @PutMapping("/acoes-exames/{id}")
	// public ProfissionalDTO atualizar(@PathVariable int id, @RequestBody
	// ProfissionalDTO dto) throws SQLException {
	// return service.atualizarAcao(id, dto);
	// }

	// // Deletar
	// @DeleteMapping("/acoes-exames/{id}")
	// public void deletar(@PathVariable int id) throws SQLException {
	// service.deletarAcao(id);
	// }

}
