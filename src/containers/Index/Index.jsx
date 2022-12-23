import { Header, ListRecipes } from "components/organisms";
import IndexStyled from "./Index.styled";

import salmonRecipe from "assets/images/salmon.jpg";
import noodleRecipe from "assets/images/noodle.jpg";
import pizzaRecipe from "assets/images/pizzaFood.jpg";
import steackRecipe from "assets/images/steack.jpg";
import pottageRecipe from "assets/images/pottage.jpg";
import saladeRecipe from "assets/images/salade.jpg";
import { useState } from "react";
import SearchHeader from "components/organisms/SearchHeader";

const Index = () => {
  const [search, setSearch] = useState([]);

  const handleClick = () => {
    let searchInput = document.getElementById("searchInput").value;
    setSearch(searchInput);
  };

  return (
    <IndexStyled>
      {search == "" ? (
        <>
          <Header handleClick={handleClick}></Header>
          <div className="bottomHeader">
            <div className="text-under-search">
              <p>
                A desire for something, indicate what you want
                <br />
                Access our many recipes indicatingall the brands to follow with
                the requested ingredients.
              </p>
              <div className="chooseRecipe">
                <span>&#8593; Choose your recipe &#8593;</span>
              </div>
            </div>

            <div className="container">
              <div className="carousel-img">
                <div className="recipeSalmon">
                  <img src={salmonRecipe} alt="salmon recipe" />
                </div>
                <div className="recipePizza">
                  <img src={pizzaRecipe} alt="pizza recipe" />
                </div>
                <div className="recipeNoodle">
                  <img src={noodleRecipe} alt="noodle recipe" />
                </div>
                <div className="recipePottage">
                  <img src={pottageRecipe} alt="potage recipe" />
                </div>
                <div className="recipeSteack">
                  <img src={steackRecipe} alt="steack recipe" />
                </div>
                <div className="recipeSalade">
                  <img src={saladeRecipe} alt="salade recipe" />
                </div>
              </div>
            </div>

            <div className="container mt-2 mb-2 text-center">
              <a href="/random" className="btn btn-oranged  mt-2">
                Get random recipe
              </a>
            </div>
          </div>
        </>
      ) : (
        <>
          <SearchHeader handleClick={handleClick}></SearchHeader>
          <div className="mx-auto text-center mt-5">
            <a href="/" className="btn btn-outline-oranged">
              Back
            </a>
          </div>
          <ListRecipes search={search}></ListRecipes>
        </>
      )}
    </IndexStyled>
  );
};

export default Index;
