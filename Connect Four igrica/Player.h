#ifndef PLAYER_H
#define PLAYER_H

#include <string>
using namespace std;

class Player {
public:
    int id;
    string name;

    Player(int i = 0) : id(i), name("") {}
};

#endif
