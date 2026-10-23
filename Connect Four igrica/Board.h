#ifndef BOARD_H
#define BOARD_H
#include <SFML/Graphics.hpp>
#include <vector>
using namespace sf;
using namespace std;
const float CELL_WIDTH = 800 / 7;
const float CELL_HEIGHT = 700 / 6;
const float PADDING = 10.f;


class Board {
    int rows = 6;
    int columns = 7;
    vector<vector<int>> grid;
    RectangleShape Boardshape;
public:
    

    Board();
    void draw(RenderWindow& window);
    bool jelipun(int stupac)const;
    bool pronadired(int stupac, int& red);
    bool provjerapobjede(int igrac, int stupac, int red);
    void postavizeton(int red, int stupac, int igrac);
    void uklonizeton(int red, int stupac);
    void reset();
    bool punaPloca() const;

};
#endif