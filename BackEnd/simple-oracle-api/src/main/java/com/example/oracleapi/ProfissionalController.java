package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://127.0.0.1:5500")

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

	@GetMapping("/profissionais/nome/{nome}")
	public List<Map<String, Object>> getProfissionaisPorNome(@PathVariable String nome) throws SQLException {
		return service.obterProfissionaisNome(nome);
	}

	@GetMapping("/setor")
	public List<Map<String, Object>> getSetores() throws SQLException {
		return service.obterSetores();
	}

	@CrossOrigin(origins = "http://127.0.0.1:5500")
	@GetMapping("/setores/{setor:[0-9]+}")
	public List<Map<String, Object>> getProfissionaisPorSetor(@PathVariable String setor) throws SQLException {
		return service.obterProfissionaisSetor(setor);
	}

}