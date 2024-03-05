import React, { useState, useEffect } from 'react';

// Assuming you have a way to get the file content, maybe as a prop or from an API
const GameSummary = ({ fileContent }) => {
    const [summary, setSummary] = useState({
        Data: '',
        HoraInicio: '',
        HoraTermino: '',
        Categoria: '',
        Player1Name: '',
        Player1Stats: '',
        Player1Points: '',
        Player1Hits: '',
        Player1Speed: '',
        Player2Name: '',
        Player2Stats: '',
        Player2Points: '',
        Player2Hits: '',
        Player2Speed: '',
        PontuacaoBruta: '',
        PontosPerdidosDesequilibrio: '',
        PontosPerdidosQueda: '',
        PontuacaoFinal: ''
    });

    const extractSummary = (content) => {
        const lines = content.split('\n');
        let extractedSummary = {
            Data: '',
            HoraInicio: '',
            HoraTermino: '',
            Categoria: '',
            Player1Name: '',
            Player1Stats: '',
            Player2Name: '',
            Player2Stats: '',
            PontuacaoBruta: '',
            PontosPerdidosDesequilibrio: '',
            PontosPerdidosQueda: '',
            PontuacaoFinal: ''
        };

        lines.forEach(line => {
            if (line.startsWith('Data:')) {
                extractedSummary.Data = line.split('Data:')[1].trim();
            } else if (line.startsWith('Hora Início:')) {
                extractedSummary.HoraInicio = line.split('Hora Início:')[1].trim();
            } else if (line.startsWith('Hora Término:')) {
                extractedSummary.HoraTermino = line.split('Hora Término:')[1].trim();
            } else if (line.startsWith('Categoria:')) {
                extractedSummary.Categoria = line.split('Categoria:')[1].trim();
            } else if (line.includes('pontos') && line.includes('golpes') && line.includes('km/h')) {
                const parts = line.split(':');
                const name = parts[0].trim();
                const stats = parts[1].trim();
                if (extractedSummary.Player1Name === '') {
                    extractedSummary.Player1Name = name;
                    extractedSummary.Player1Stats = stats;
                    var arrStats = stats.split(' / ');
                    extractedSummary.Player1Points = arrStats[0];
                    extractedSummary.Player1Hits = arrStats[1];
                    extractedSummary.Player1Speed = arrStats[2];
                    
                } else {
                    extractedSummary.Player2Name = name;
                    extractedSummary.Player2Stats = stats;
                    var arrStats = stats.split(' / ');
                    extractedSummary.Player2Points = arrStats[0];
                    extractedSummary.Player2Hits = arrStats[1];
                    extractedSummary.Player2Speed = arrStats[2];
                }
            } else if (line.startsWith('Pontuação bruta:')) {
                extractedSummary.PontuacaoBruta = line.split('Pontuação bruta:')[1].trim();
            } else if (line.startsWith('Pontos perdidos por Desequilibrio:')) {
                extractedSummary.PontosPerdidosDesequilibrio = line.split('Pontos perdidos por Desequilibrio:')[1].trim();
            } else if (line.startsWith('Pontos perdidos por Quedas:')) {
                extractedSummary.PontosPerdidosQueda = line.split('Pontos perdidos por Quedas:')[1].trim();
            } else if (line.startsWith('Pontuação Final:')) {
                extractedSummary.PontuacaoFinal = line.split('Pontuação Final:')[1].trim();
            }
        });

        setSummary(extractedSummary);
    };

    useEffect(() => {
        if (fileContent) {
            extractSummary(fileContent);
        }
    }, [fileContent]);

    return (
        <div className="container mt-4">
            <h2>Totalizadores da partida</h2>
            {/* <textarea>{fileContent}</textarea> */}
            <div className="row">
                <div className="col-12">
                    <div className="form-row">
                        {/* Column 1 */}
                        <div className="col-md-2 col-2">
                            <div className="form-group">
                                <label htmlFor="data">Data</label>
                                <input type="text" className="form-control" id="data" value={summary.Data} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="horaInicio">Hora Início</label>
                                <input type="text" className="form-control" id="horaInicio" value={summary.HoraInicio} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="horaTermino">Hora Término</label>
                                <input type="text" className="form-control" id="horaTermino" value={summary.HoraTermino} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="categoria">Categoria</label>
                                <input type="text" className="form-control" id="categoria" value={summary.Categoria} readOnly />
                            </div>
                        </div>

                        <div className="col-md-3 col-3 offset-md-1">
                            <div className="form-group">
                                <label htmlFor="player1Name">Jogador 1</label>
                                <input type="text" className="form-control" id="player1Name" value={summary.Player1Name} readOnly />
                            </div>
                            {/* <div className="form-group">
                                <label htmlFor="player1Stats">Estatísticas Jogador 1</label>
                                <input type="text" className="form-control" id="player1Stats" value={summary.Player1Stats} readOnly />
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="player1Stats">Pontos Jogador 1</label>
                                <input type="text" className="form-control" id="player1Stats" value={summary.Player1Points} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="player1Stats">Golpes Jogador 1</label>
                                <input type="text" className="form-control" id="player1Stats" value={summary.Player1Hits} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="player1Stats">Velocidade Jogador 1</label>
                                <input type="text" className="form-control" id="player1Stats" value={summary.Player1Speed} readOnly />
                            </div>
                        </div>

                        <div className="col-md-3 col-3">
                            <div className="form-group">
                                <label htmlFor="player2Name">Jogador 2</label>
                                <input type="text" className="form-control" id="player2Name" value={summary.Player2Name} readOnly />
                            </div>
                            {/* <div className="form-group">
                                <label htmlFor="player2Stats">Estatísticas Jogador 2</label>
                                <input type="text" className="form-control" id="player2Stats" value={summary.Player2Stats} readOnly />
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="player2Stats">Pontos Jogador 2</label>
                                <input type="text" className="form-control" id="player2Stats" value={summary.Player2Points} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="player2Stats">Golpes Jogador 2</label>
                                <input type="text" className="form-control" id="player2Stats" value={summary.Player2Hits} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="player2Stats">Velocidade Jogador 2</label>
                                <input type="text" className="form-control" id="player2Stats" value={summary.Player2Speed} readOnly />
                            </div>
                        </div>

                        <div className="col-md-2 col-2 offset-md-1">
                            <div className="form-group">
                                <label htmlFor="pontuacaoBruta">Pontuação Bruta</label>
                                <input type="text" className="form-control" id="pontuacaoBruta" value={summary.PontuacaoBruta} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pontosPerdidosDesequilibrio">Pontos Perdidos por Desequilíbrio</label>
                                <input type="text" className="form-control" id="pontosPerdidosDesequilibrio" value={summary.PontosPerdidosDesequilibrio} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pontosPerdidosQueda">Pontos Perdidos por Queda</label>
                                <input type="text" className="form-control" id="pontosPerdidosQueda" value={summary.PontosPerdidosQueda} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pontuacaoFinal">Pontuação Final</label>
                                <input type="text" className="form-control" id="pontuacaoFinal" value={summary.PontuacaoFinal} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default GameSummary;
