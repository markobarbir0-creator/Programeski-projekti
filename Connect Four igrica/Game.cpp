#include "Game.h"
#include <cstdlib>
#include <ctime>

Game::Game() {
    srand(time(nullptr));
    stanjeIgre = izbornik;

    p1.id = 1;
    p2.id = 2;
    currentplayer = rand() % 2 + 1;

    font.loadFromFile("C:/Windows/Fonts/arial.ttf");

    naslov.setFont(font);
    naslov.setString("CONNECT 4");
    naslov.setCharacterSize(60);
    naslov.setPosition(200, 100);

    gumbDvaIgraca.setSize(Vector2f(450, 80));
    gumbDvaIgraca.setPosition(150, 250);
    gumbDvaIgraca.setFillColor(Color::Green);

    gumbRacunalo.setSize(Vector2f(450, 80));
    gumbRacunalo.setPosition(150, 360);
    gumbRacunalo.setFillColor(Color::Red);

    gumbExit.setSize(Vector2f(450, 80));
    gumbExit.setPosition(150, 250);
    gumbExit.setFillColor(Color::Green);

    gumbRestart.setSize(Vector2f(450, 80));
    gumbRestart.setPosition(150, 360);
    gumbRestart.setFillColor(Color::Red);

    tekstDvaIgraca.setFont(font);
    tekstDvaIgraca.setString("PLAYER VS PLAYER");
    tekstDvaIgraca.setCharacterSize(40);
    tekstDvaIgraca.setPosition(180, 265);

    tekstRacunalo.setFont(font);
    tekstRacunalo.setString("PLAYER VS BOT");
    tekstRacunalo.setCharacterSize(40);
    tekstRacunalo.setPosition(180, 375);

    tekstRestart.setFont(font);
    tekstRestart.setString("RESTART");
    tekstRestart.setCharacterSize(40);
    tekstRestart.setPosition(180, 375);

    tekstExit.setFont(font);
    tekstExit.setString("EXIT");
    tekstExit.setCharacterSize(40);
    tekstExit.setPosition(180, 265);

    tekstPobjede.setFont(font);
    tekstPobjede.setCharacterSize(50);
    tekstPobjede.setPosition(200, 100);

    tekstPrvi.setFont(font);
    tekstPrvi.setCharacterSize(60);
    tekstPrvi.setPosition(180, 350);

    tekstUnosImena.setFont(font);
    tekstUnosImena.setCharacterSize(40);
    tekstUnosImena.setFillColor(Color::White);
    tekstUnosImena.setPosition(150, 500);

    pada = false;
    igragotova = false;
    prikazprvog = false;
    fazaUnosa = 0;
    bufferIme.clear();
}

bool Game::jeIzbornik() { return stanjeIgre == izbornik; }
bool Game::jeMenu() { return stanjeIgre == Menu; }
bool Game::jeIgraGotova() { return igragotova; }
StanjeIgre Game::getStanje() { return stanjeIgre; }
void Game::setStanje(StanjeIgre s) { stanjeIgre = s; }

void Game::obradiKlikEnd(Vector2i mis) {
    if (gumbRestart.getGlobalBounds().contains(mis.x, mis.y))
        stanjeIgre = Restart;
    else if (gumbExit.getGlobalBounds().contains(mis.x, mis.y))
        stanjeIgre = Exit;
}

void Game::obradiKlikIzbornika(Vector2i mis) {
    if (fazaUnosa > 0) return;

    if (gumbDvaIgraca.getGlobalBounds().contains(mis.x, mis.y)) {
        fazaUnosa = 1;
        bufferIme.clear();
    }
    else if (gumbRacunalo.getGlobalBounds().contains(mis.x, mis.y)) {
        fazaUnosa = 1;
        p2.name = "BOT";
        bufferIme.clear();
    }
}

void Game::handleclick(int x) {
    if ((stanjeIgre == izbornik || stanjeIgre == Menu) || igragotova || pada || prikazprvog)
        return;

    stupac = x / CELL_WIDTH;
    if (stupac >= 0 && stupac < 7 && !board.jelipun(stupac)) {
        board.pronadired(stupac, red);
        pada = true;
        animstupac = stupac;
        animred = red;
        animigrac = currentplayer;
        animY = 0;
    }
}

bool Game::mozePobjedit(int igrac, int stupac) {
    int r;
    if (!board.pronadired(stupac, r)) return false;
    board.postavizeton(r, stupac, igrac);
    bool win = board.provjerapobjede(igrac, stupac, r);
    board.uklonizeton(r, stupac);
    return win;
}

int Game::odaberiNajboljiStupacAI() {
    for (int s = 0; s < 7; s++)
        if (!board.jelipun(s) && mozePobjedit(2, s))
            return s;

    for (int s = 0; s < 7; s++)
        if (!board.jelipun(s) && mozePobjedit(1, s))
            return s;

    int s;
    do { s = rand() % 7; } while (board.jelipun(s));
    return s;
}

void Game::update() {
    if (prikazprvog) {
        if (prvi.getElapsedTime().asSeconds() > 5.f)
            prikazprvog = false;
        else return;
    }

    if (stanjeIgre == JedanIgrac && currentplayer == 2 && !pada && !igragotova) {
        int s = odaberiNajboljiStupacAI();
        handleclick(s * CELL_WIDTH);
    }

    if (!pada) {
        return;
    }

    float ciljaniY = animred * CELL_HEIGHT + PADDING;
    if (animY < ciljaniY) {
        animY += CELL_HEIGHT / (0.3f * 60.f);
    }
    else {
        board.postavizeton(animred, animstupac, animigrac);
        pada = false;

        if (board.provjerapobjede(animigrac, animstupac, animred)) {
            igragotova = true;
            pobjednik = animigrac;
            tekstPobjede.setString(
                (pobjednik == 1 ? p1.name : p2.name) + " JE POBIJEDIO"
            );
        }
        else if (board.punaPloca()) {
            igragotova = true;
            pobjednik = 0;
            tekstPobjede.setString("IZJEDNACENO!");
        }
        else {
            currentplayer = (currentplayer == 1 ? 2 : 1);
        }
    }
}
    

void Game::resetGame() {
    board.reset();
    igragotova = false;
    pada = false;
    prikazprvog = false;
    currentplayer = rand() % 2 + 1;
}

void Game::potvrdiIme() {
    if (fazaUnosa == 1) {
        p1.name = bufferIme;
        bufferIme.clear();
        fazaUnosa = (p2.name == "BOT" ? 0 : 2);
    }
    else if (fazaUnosa == 2) {
        p2.name = bufferIme;
        bufferIme.clear();
        fazaUnosa = 0;
    }

    if (fazaUnosa == 0) {
        stanjeIgre = (p2.name == "BOT" ? JedanIgrac : DvaIgraca);
        prikazprvog = true;
        prvi.restart();
        tekstPrvi.setString(
            "PRVI IGRA: " + (currentplayer == 1 ? p1.name : p2.name)
        );
    }
}

void Game::draw(RenderWindow& w) {
    if (stanjeIgre == izbornik) {
        w.draw(naslov);
        w.draw(gumbDvaIgraca);
        w.draw(gumbRacunalo);
        w.draw(tekstDvaIgraca);
        w.draw(tekstRacunalo);

        if (fazaUnosa > 0) {
            tekstUnosImena.setString(
                (fazaUnosa == 1 ? "PLAYER 1: " : "PLAYER 2: ")
                + bufferIme
            );
            w.draw(tekstUnosImena);
        }
        return;
    }

    if (prikazprvog) {
        w.draw(tekstPrvi);
        return;
    }

    if (!igragotova)
        board.draw(w);
    else {
        w.draw(tekstPobjede);
        w.draw(gumbRestart);
        w.draw(gumbExit);
        w.draw(tekstRestart);
        w.draw(tekstExit);
    }

    if (pada) {
        CircleShape c(45.f);
        c.setPosition(animstupac * CELL_WIDTH + PADDING, animY);
        c.setFillColor(animigrac == 1 ? Color::Yellow : Color::Red);
        w.draw(c);
    }
}
