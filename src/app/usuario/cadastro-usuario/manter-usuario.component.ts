import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { Usuario } from "../../shared/model/usuario";
import { UsuarioRestService } from "../../shared/services/usuario-rest.service";
import { MensagemSweetService } from "../../shared/services/mensagem-sweet.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './manter-usuario.component.html',
  styleUrl: './manter-usuario.component.scss'
})
export class ManterUsuarioComponent {
  usuario = new Usuario('1', '', 0);
  modoEdicao = false;

  constructor(
    private roteador: Router,
    private rotaAtual: ActivatedRoute,
    private usuarioService: UsuarioRestService,
    private mensagemService: MensagemSweetService
  ) {
    const idParaEdicao = rotaAtual.snapshot.paramMap.get('id');

    if (idParaEdicao) {
      this.modoEdicao = true;

      usuarioService.listar().subscribe({
        next: (usuarios) => {
          const usuarioAEditar = usuarios.find(usuario => usuario.id == idParaEdicao);
          if (usuarioAEditar) {
            this.usuario = usuarioAEditar;
          }
        }
      })
    }
  }

  inserir() {
    if (!this.modoEdicao) {
      this.usuarioService.inserir(this.usuario).subscribe({
        next: () => {
          this.roteador.navigate(['listagem-usuarios']);
          this.mensagemService.sucesso('Usuário cadastrado com sucesso.');
        },
        error: (e) => {
          this.mensagemService.erro(e.message);
        },
      });
    } else {
      this.usuarioService.editar(this.usuario).subscribe({
        next: () => {
          this.roteador.navigate(['listagem-usuarios']);
          this.mensagemService.sucesso('Usuário editado com sucesso.');
        },
        error: (e) => {
          this.mensagemService.erro(e.message);
        },
      })
    }
  }
}
