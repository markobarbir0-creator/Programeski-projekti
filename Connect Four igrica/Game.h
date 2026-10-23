#ifndef GAME_H
#define GAME_H
#include <SFML/Graphics.hpp>
#include <string>
#include "Board.h"
#include "Player.h"

using namespace sf;
using namespace std;



enum StanjeIgre { izbornik, Menu, JedanIgrac, DvaIgraca, Restart, Exit };

class Game {
private:
    Board board;
    Player p1, p2;
    int currentplayer;
    int stupac, red;
    bool pada;
    int animstupac, animred, animigrac;
    float animY;
    float brzina;
    bool igragotova;
    int pobjednik;
    bool prikazprvog;
    StanjeIgre stanjeIgre;
    RectangleShape gumbDvaIgraca, gumbRacunalo, gumbExit, gumbRestart;
    Font font;
    Text naslov, tekstDvaIgraca, tekstRacunalo, tekstPobjede, tekstPrvi;
    Text tekstRestart, tekstExit;
    Text tekstUnosImena;
    Clock prvi;
   
    int fazaUnosa;
    bool mozePobjedit(int igrac, int stupac);
    int odaberiNajboljiStupacAI();

public:
    Game();
    string bufferIme;
    bool jeIzbornik();
    bool jeMenu();
    bool jeIgraGotova();
    StanjeIgre getStanje();
    void setStanje(StanjeIgre s);
    Board& getboard();
    void obradiKlikEnd(Vector2i mis);
    void obradiKlikIzbornika(Vector2i mis);
    void handleclick(int x);
    void update();
    void resetGame();
    void potvrdiIme();
    void draw(RenderWindow& w);
};
#endif
