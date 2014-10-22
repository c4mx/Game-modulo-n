/**
 *
 * Created by Jianqiao on 09/10/14.
 */

$(document).ready(function(){

    $("#config").click(function() {
        var mod_number_char = document.getElementById("modulo_number").value;
        mod_number = parseInt(mod_number_char);
        mod_array = moduloArray(mod_number);
        boardGenerator(mod_array);
        waitOperation();
        showSolution();
        });

    function moduloArray() {
        var mod_array = [];
        for(var i = 0; i < mod_number; i++){
            mod_array[i] = [];
            for(var j = 0; j < mod_number; j++){
                mod_array[i][j] = Math.floor((Math.random()*mod_number));
            }
        }
        return mod_array;
    }

    function boardGenerator(mod_array) {
        var board = document.getElementById("board");
        var old_table = document.getElementById("jeu_modulo_n");
        if (old_table) {
            board.removeChild(old_table);
        }
        var table = document.createElement("table");
        table.setAttribute("id", "jeu_modulo_n");
        board.appendChild(table);
        for(var i = 0; i < mod_number; i++){
            var row = table.insertRow(-1);
            for(var j = 0; j < mod_number; j++){
                var cell = row.insertCell(-1);
                var id = i.toString() + j.toString();
                cell.setAttribute("id", id);
                cell.innerHTML = mod_array[i][j].toString();
            }
        }
    }

    function waitOperation() {
        var td = document.getElementsByTagName("td");
        for (var i=0; i < td.length; i++) {
            td[i].onclick = function() {
                var id_char = this.getAttribute("id");
                var id = parseInt(id_char);
                var row = Math.floor(id/10);
                var col = id%10;
                changeArrayValue(row, col);
                changeBoardValue();
            }
        }
    }

    function changeArrayValue(row, col) {
        for (var i = 0; i < mod_number; i++) {
            mod_array[i][col]++;
            mod_array[i][col] = mod_array[i][col] % mod_number;
        }

        for (var j = 0; j < mod_number; j++) {
            if (j != col) {
                mod_array[row][j]++;
                mod_array[row][j] = mod_array[row][j] % mod_number;
            }
        }
    }

    function changeBoardValue() {
        var td = document.getElementsByTagName("td");
        for (var i=0; i < td.length; i++) {
            var id_char = td[i].getAttribute("id");
            var id = parseInt(id_char);
            var row = Math.floor(id/10);
            var col = id%10;
            td[i].firstChild.nodeValue = mod_array[row][col].toString();
            }
        }

    function solutionArray() {

        var obj = 0;
        var min_count = 10000;
        var count = 0;
        // Find the best solution
        for (var k = 0 ; k < mod_number; k++) {

            var solution_array = [];
            for(var i = 0; i < mod_number; i++){
                solution_array[i] = [];
                for(var j = 0; j < mod_number; j++){
                    solution_array[i][j] = 0;
                }
            }

            var add = 0;
            if (mod_number == 2) {
                nb1 = nb2 = 0;
            } else {
                nb1 = mod_number - 2;
                nb2 = mod_number - 3;
            }
            for (i = 0; i < mod_number; i++) {
                for (j = 0; j < mod_number; j++) {
                    if (mod_array[i][j] != obj) {
                        if (mod_array[i][j] > obj) {
                            add = obj + mod_number - mod_array[i][j];
                        } else {
                            add = obj - mod_array[i][j];
                        }

                        solution_array[i][j] += nb1*add;

                        for (var m = 0; m < mod_number; m++) {
                            for (var n = 0; n < mod_number; n++) {
                                solution_array[m][n] += nb2*add;
                                if (m != i && n != j) {
                                    solution_array[m][n] += add;
                                }
                            }
                        }
                    }
                }
            }

            for (m = 0; m < mod_number; m++) {
                for (n = 0; n < mod_number; n++) {
                    solution_array[m][n] = solution_array[m][n] % mod_number;
                    count += solution_array[m][n];
                }
            }

            if (count < min_count) {
                var best_solution = solution_array;
                min_count = count;
            }

            if (obj == mod_number-1) {
                return best_solution;
            } else {
                obj++;
            }

        }

    }

    function showSolution() {
        var old_solution = document.getElementById("solution");
        if (!old_solution) {
        } else {
            old_solution.parentNode.removeChild(old_solution);
        }
        var solution = document.createElement("button");
        solution.setAttribute("id", "solution");
        var solution_text = document.createTextNode("Solution");
        solution.appendChild(solution_text);
        var help = document.getElementById("help");
        help.appendChild(solution);

        solution.onclick = function() {
            var solution_array = solutionArray();
            changeNumber(solution_array);
        }
    }

    function changeNumber(solution_array) {
        find:
        for (var i = 0; i < mod_number; i++) {
            for (var j = 0 ; j < mod_number; j++) {
                if (solution_array[i][j] != 0) {
                    changeArrayValue(i, j);
                    changeBoardValue();
                    solution_array[i][j]--;
                    setTimeout(function(){changeNumber(solution_array)}, 300);
                    break find;
                }
            }
        }
        return true;
    }

});
